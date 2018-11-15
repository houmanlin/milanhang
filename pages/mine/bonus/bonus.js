const app = getApp()

Page({
  data:{
    moneyInput: '',
    showLink: true,
    myMoney: 0,
    name: '',
    num: '',
    type: '',
    userName: '',
    memId: '',
    yaoqingNum: 0,
    tuijianNum: 0
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  openBank: function() {
    wx.navigateTo({
      url: '../bank/bank'
    })
  },
  bindInput: function(e) {
    var vm = this
    vm.data.moneyInput = e.detail.value
    vm.setData({
      moneyInput: e.detail.value
    })
  },
  onLoad: function(options) {
    var vm = this
    vm.data.name = options.name
    vm.data.num = options.num
    vm.data.type = options.type
    vm.data.userName = options.userName
    console.log(options)
    if(options.name){
      vm.setData({
        showLink: false,
        name: options.name,
        num: options.num,
      })
    }else{
      vm.setData({
        showLink: true
      })
    }
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
          vm.data.memId = res.data.rows.memId
          // 查看邀请好友有几人
          wx.request({
            url: app.globalData.getAgentCount,
            method: "POST",
            data: {
              memId: vm.data.memId
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
              console.log(data.data.count)
              vm.setData({
                yaoqingNum: data.data.count
              })
            },
            fail: function (res) {
              console.log(res);
            }
          })
          // 查询好友推荐人数
          wx.request({
            url: app.globalData.getAgentIICount,
            method: "POST",
            data: {
              memId: vm.data.memId
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
              console.log(data.data.count)
              vm.setData({
                tuijianNum: data.data.count
              })
            },
            fail: function (res) {
              console.log(res);
            }
          })
          // 获取账单余额
          wx.request({
            url: app.globalData.calcrefunds,
            method: "POST",
            data: {
              memId: vm.data.memId
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res){
              vm.data.myMoney = res.data.money
              vm.setData({
                myMoney: res.data.money
              })
            },
            fail: function() {
            },
            complete: function() {
            }
          })
        }else if(res.data.code === 500){
          console.log('会员信息为空')
          vm.setData({
            myMoney: 0,
            yaoqingNum: 0,
            tuijianNum: 0
          })
        }
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  },
  btnclick: function() {
    var vm = this
    if( vm.data.moneyInput  <=  vm.data.myMoney) {
      // 判断用户是否绑定了手机号
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
              url: '../../login/login'
            })
          }else if (data.data.code === 500) {
            console.log("该用户已经绑定过手机号")
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
                        vm.data.memId = res.data.rows.memId
                        // 返给后台数据
                        wx.request({
                          url: app.globalData.applyrefunds,
                          method: "POST",
                          data: {
                            openid: app.globalData.openid,
                            refund_type: 0,
                            memId: vm.data.memId,
                            accountType: vm.data.type,
                            accountName: vm.data.userName,
                            cardNum: vm.data.num,
                            money: vm.data.moneyInput
                          },
                          header: {
                            "content-type": "application/x-www-form-urlencoded"
                          },
                          success: function (data) {
                            console.log(data)
                            if(data.data.code === 200) {
                              wx.showToast({
                                title: '提现申请成功，请等待后台审核',
                                icon: "none",
                                duration: 3000
                              })
                            }else if(data.data.code === 500) {
                              wx.showToast({
                                title: '提现申请失败，请重试',
                                icon: "none"
                              })
                              console.log('失败')
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
                    content: '您还不是会员哦~',
                    cancelText: '放弃注册',
                    confirmText: '成为会员',
                    success: function(res) {
                      if(res.confirm) {
                        wx.navigateTo({
                          url: '../register-member/register-member'
                        })
                      }else if (res.cancel) {
                        wx.showToast({
                          title: '已放弃此次成为会员',
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
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }else{
      wx.showToast({
        title: '提取额度大于余额了呦~',
        icon: 'none'
      })
    }
  },
  openTranslate: function() {
    wx.navigateTo({
      url: '../translate/translate'
    })
  }
})