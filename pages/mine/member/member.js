const app = getApp()

Page({
  data: {
    yaoqing: '',
    hidden: true,
    state: ''
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  onShow: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    // 获取用户代理码
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
        console.log(res)
        if(res.data.code === 200) {
          console.log('您已是会员')
          vm.setData({
            yaoqing: '会员码：' + res.data.rows.memId,
            hidden: true,
          })
        }else if(res.data.code === 500){
          console.log('您还不是会员')
        }
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  },
  openRegisterMember: function() {
    var vm = this
    // 验证用户是否是会员
    wx.request({
      url: app.globalData.authMemberByUser,
      data: {
        openid: app.globalData.openid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.code == 200) {
          // 获取用户会员到期时间
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
                vm.data.state = res.data.rows.memStatus
                if(vm.data.state == 1) {
                  wx.showModal({
                    title: '提示',
                    content: '已经是体验会员啦，是否升级正式会员呢？',
                    cancelText: '我再想想',
                    confirmText: '愉快升级',
                    success: function(res) {
                      if(res.confirm) {
                        wx.navigateTo({
                          url: "../register-sheng/register-sheng"
                        })
                      }else if(res.cancel){
                        wx.showToast({
                          title:'我暂时放弃升级啦',
                          icon:'none',
                          duration: 3000
                        })
                      }
                    }
                  })
                }else if(vm.data.state == 2){
                  wx.showModal({
                    title: '提示',
                    content: '已经是正式会员啦，是否续费呢？',
                    cancelText: '我再想想',
                    confirmText: '继续续费',
                    success: function(res) {
                      if(res.confirm) {
                        wx.navigateTo({
                          url: "../register-again/register-again"
                        })
                      }else if(res.cancel){
                        wx.showToast({
                          title:'我暂时放弃续费啦',
                          icon:'none',
                          duration: 3000
                        })
                      }
                    }
                  })
                }
              }else if(res.data.code === 500){
                console.log('您还没有会员信息')
              }
            },
            fail: function() {
            },
            complete: function() {
            }
          })
        }else if(res.data.code == 500){
          // 判断用户是否已经绑定过电话号
          wx.request({
            url: app.globalData.authPhoneMsg,
            method: "POST",
            data: {
              openid: app.globalData.openid
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
              console.log(data)
              if(data.data.code === 200){
                console.log('该用户初次绑定手机号码')
                wx.navigateTo({
                  url: '../login-member/login-member'
                })
              }else if (data.data.code === 500) {
                console.log("该用户已经绑定过手机号")
                wx.navigateTo({
                  url: "../register-member/register-member"
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  }
})