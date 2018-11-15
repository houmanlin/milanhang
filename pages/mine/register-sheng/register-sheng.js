const app = getApp()

Page({
  data:{
    memberYearList: [],
    yearIndex: 0,
    stateList: [],
    stateIndex: 0,
    search: {
      // yearType: null,
      yearType: 1,
      stateValue: null
    },
    moneyValue: 0,
    yearValue: '一年',
    yaoqingvalue: "",
    disabled: true
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  yaoqingValue: function(e) {
    var vm = this
    vm.setData({
      yaoqingvalue: e.detail.value
    })
  },
  onLoad: function() {
  },
  sendRegister: function() {
    var vm = this
    // 支付接口
    wx.request({
      url: app.globalData.pay,
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        body: '会员支付',
        total: 188
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data) {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log("支付成功");
              console.log(res)
              // 支付成功后判断用户是否注册成功
              wx.request({
                url: app.globalData.submitMember,
                data: {
                  openid: app.globalData.openid,
                  memberType: 1,
                  discount: 188,
                  couponId: '001',
                  memState: 1,
                  agId: vm.data.yaoqingvalue,
                  memStatus: 3
                },
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                  console.log(res)
                  if(res.data.code === 200) {
                    wx.showToast({
                      title: '升级成功',
                      icon: 'none',
                      duration: 3000
                    })
                    // wx.switchTab({
                    //   url: '../my/my',
                    // })
                  }else if(res.data.code === 500) {
                    wx.showToast({
                      title: '升级失败,请重试',
                      icon: 'none',
                      duration: 3000
                    })
                  }
                },
                fail: function (res) {
                  console.log(res);
                }
              })
            },
            'fail': function (res) {
              wx.showToast({
                title: '本次支付有误或已取消，请检查选填项',
                icon: 'none',
                duration: 3000
              })
              console.log("支付失败");
            }
          })
        }
      }
    })
  }
})