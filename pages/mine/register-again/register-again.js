const app = getApp()

Page({
  data:{
    memberYearList: [],
    yearIndex: 0,
    search: {
      yearType: null
    },
    moneyValue: 0,
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  yearChange: function(e) {
    var vm = this
    vm.data.search.yearType = vm.data.memberYearList[e.detail.value].fieldValue
    // 会员钱数
    if(vm.data.search.yearType != 0){
      wx.request({
        url: app.globalData.getSecCode,
        method: 'POST',
        data: {
          fieldName: 'discount',
          fieldValue: vm.data.search.yearType
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res){
          vm.data.moneyValue = res.data.list[0].valueMeaning
          vm.setData({
            moneyValue: vm.data.moneyValue
          })
        },
        fail: function() {
        },
        complete: function() {
        }
      })
    }else{
      vm.setData({
        moneyValue: 0
      })
    }
    this.setData({
      search: vm.data.search,
      yearIndex: e.detail.value
    })
  },
  onLoad: function() {
    var vm = this
    // 会员年限
    wx.request({
      url: app.globalData.getSecCode,
      method: 'POST',
      data: {
        fieldName: 'memberType',
        fieldValue: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        console.log(res.data.list)
        vm.data.memberYearList = res.data.list
        vm.data.memberYearList.unshift({
          fieldName: "memberType",
          sn: "0",
          valueMeaning: "请选择会员年限",
          fieldValue: 0,
        })
        vm.setData({
          memberYearList: res.data.list
        })
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  },
  sendRegister: function() {
    var vm = this
    if(vm.data.search.yearType === null || vm.data.search.yearType === undefined || vm.data.search.yearType==0){
      wx.showToast({
        title:'请选择会员年限',
        icon:'none',
        duration: 2000
      })
      return false
    }

    // 支付接口
    if(vm.data.search.yearType !== 0) {
      wx.request({
        url: app.globalData.pay,
        method: 'POST',
        data: {
          openid: app.globalData.openid,
          body: '会员支付',
          total: vm.data.moneyValue
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if(res.data){
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
                    memberType: vm.data.search.yearType,
                    discount: vm.data.moneyValue,
                    couponId: '001',
                    memState: 2,
                    agId: '',
                    memStatus: 0
                  },
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  success: function (res) {
                    console.log(res)
                    if(res.data.code === 200) {
                      wx.showToast({
                        title: '注册成功',
                        icon: 'none',
                        duration: 3000
                      })
                    }else if(res.data.code === 500) {
                      wx.showToast({
                        title: '注册失败,请重试',
                        icon: 'none'
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(res);
                  }
                })
              },
              'fail': function (res) {
                //支付失败后的回掉
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
    }else{
      wx.showToast({
        title:'请检查选填项',
        icon:'none',
        duration: 2000
      })
      return false
    }
  }
})