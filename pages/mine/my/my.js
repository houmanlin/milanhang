const app = getApp()

Page({
  data:{
    userInfo: {},
    hasUserInfo: false,
    vipImg: '../../../static/img/myvip_03.png',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hidden: true,
    showIfMember: false,
    endTime: '',
    formalTime: '',
    state: '',
  },
  onLoad: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    console.log(app.globalData.userInfo)
    if(app.globalData.userInfo) {
      vm.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }else if (this.data.canIUse){
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
  },
  onShow: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
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
          console.log('您已是会员')
          vm.setData({
            showIfMember: true,
          })
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
              console.log(res)
              if(res.data.code === 200) {
                console.log('您已是会员')
                vm.data.state = res.data.rows.memStatus
                console.log(vm.data.state)
                if(vm.data.state == 1) {
                  vm.setData({
                    vipImg: '../../../static/img/tiyan.png',
                  })
                }else if(vm.data.state == 2){
                  vm.setData({
                    vipImg: '../../../static/img/myvip_03.png',
                  })
                }
                if(res.data.rows.endTime){
                  vm.data.endTime = res.data.rows.endTime.substring(0,10)
                }
                if(res.data.rows.formalTime){
                  vm.data.formalTime = res.data.rows.formalTime.substring(0,10)
                }
                vm.setData({
                  endTime: vm.data.endTime,
                  formalTime: vm.data.formalTime,
                  state: vm.data.state
                })
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
          console.log('您还不是会员')
          vm.setData({
            vipImg: '../../../static/img/novip.png',
            showIfMember: false
          })
        }
        vm.setData({
          hidden: true
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  openWallet: function(){
    wx.navigateTo({
      url: '../wallet/wallet'
    })
  },
  openBonus:function() {
    wx.navigateTo({
      url: '../bonus/bonus'
    })
  },
  openCoupons: function() {
    wx.navigateTo({
      url: '../coupons/coupons'
    })
  },
  openMember: function() {
    wx.navigateTo({
      url: '../member/member'
    })
  },
  openAgent: function() {
    wx.navigateTo({
      url: '../agent/agent'
    })
  },
  openMobilePhone: function() {
    wx.makePhoneCall({
      phoneNumber: '024-31507533'
    })
  },
  openRegisterAgain: function() {
    wx.navigateTo({
      url: '../register-again/register-again'
    })
  },
  openRegisterSheng: function() {
    wx.navigateTo({
      url: '../register-sheng/register-sheng'
    })
  }
})