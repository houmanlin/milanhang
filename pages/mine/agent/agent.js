const app = getApp()

Page({
  data:{
    username: '',
    school: '',
    mobile: '',
    code: '',
    name: '获取验证码',
    time: 0,
    disabled: false,
    handle: null,
    memId: ''
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  usernameInput: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  schoolInput: function(e){
    this.setData({
      school: e.detail.value
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
      url: app.globalData.checkAgentPhone,
      method: "POST",
      data: {
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
            title: '此手机号已被注册',
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
  // 点击确定按钮
  btnclick: function() {
    var that = this
    var username = that.data.username
    var school = that.data.school
    var mobile = that.data.mobile
    var code = that.data.code
    if (app.showModal(username.length == 0, "请输入您的姓名！")) {
      return;
    }
    if (app.showModal(school.length == 0, "请输入所在学校！")) {
      return;
    }
    if (app.showModal(mobile.length == 0, "请输入手机号！")) {
      return;
    }
    if (app.showModal(code.length == 0, "请输入验证码！")) {
      return;
    }
    // 判断用户是否是会员
    wx.request({
      url: app.globalData.authMemberByUser,
      data: {
        openid: app.globalData.openid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        if(res.data.code == 200){
          // 获取会员id
          wx.request({
            url: app.globalData.getUserMemberMsg,
            data: {
              openid: app.globalData.openid
            },
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res){
              if(res.data.code === 200) {
                that.data.memId = res.data.rows.memId
                // 查看申请人下有几人
                wx.request({
                  url: app.globalData.getAgentCount,
                  method: "POST",
                  data: {
                    memId: that.data.memId
                  },
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  success: function (data) {
                    console.log(data.data.count)
                    if(data.data.count >= 10 ){
                      // 校园代理申请
                      wx.request({
                        url: app.globalData.applyCampusAgent,
                        method: "POST",
                        data: {
                          type: 0,
                          ag_type: 1,
                          ag_name: that.data.username,
                          ag_college: that.data.school,
                          ag_phone: that.data.mobile,
                          sn: app.globalData.openid
                        },
                        header: {
                          "content-type": "application/x-www-form-urlencoded"
                        },
                        success: function (data) {
                          if(data.data.code === 200) {
                            wx.showToast({
                              title: '申请代理成功，请等待后台审核',
                              icon: "none",
                              duration: 3000
                            })
                            wx.navigateBack({
                              delta: 1
                            })
                            console.log('成功')
                          }else if(data.data.code === 500) {
                            wx.showToast({
                              title: '申请代理失败',
                              icon: "none"
                            })
                            console.log('失败')
                          }
                        },
                        fail: function (res) {
                          console.log(res);
                        }
                      })
                    }else if(data.data.count < 10) {
                      wx.showToast({
                        title: '需要邀请10人后才能注册校园合伙人哦',
                        icon: 'none'
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(res);
                  }
                })
              }else if(res.data.code === 500){
                console.log('会员信息为空')
              }
            },
            fail: function() {
            },
            complete: function() {
            }
          })
        }else if(res.data.code == 500){
          wx.showModal({
            title: '提示',
            content: '成为会员才可以注册合伙人哦~',
            cancelText: '放弃注册',
            confirmText: '成为会员',
            success: function(res) {
              if(res.confirm) {
                wx.navigateTo({
                  url: '../register-member/register-member'
                })
              }else if (res.cancel) {
                console.log('您已放弃成为会员')
                wx.showToast({
                  title: '已放弃此次成为校园合伙人',
                  icon: 'none'
                })
              }
            }
          })
        }
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  }
})