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
    // disabled: true
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  stateChange: function(e) {
    var vm = this
    vm.data.search.stateValue = vm.data.stateList[e.detail.value].fieldValue
    if(vm.data.search.stateValue == 1) {
      wx.request({
        url: app.globalData.getSecCode,
        method: 'POST',
        data: {
          fieldName: 'discount',
          fieldValue: 3
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res){
          console.log(res)
          vm.data.moneyValue = res.data.list[0].valueMeaning
          vm.setData({
            // disabled: true,
            moneyValue: vm.data.moneyValue
          })
        },
        fail: function() {
        },
        complete: function() {
        }
      })
    }else if(vm.data.search.stateValue == 2){
      wx.request({
        url: app.globalData.getSecCode,
        method: 'POST',
        data: {
          fieldName: 'discount',
          fieldValue: 1
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res){
          console.log(res)
          vm.data.moneyValue = res.data.list[0].valueMeaning
          vm.setData({
            // disabled: false,
            moneyValue: vm.data.moneyValue
          })
        },
        fail: function() {
        },
        complete: function() {
        }
      })
    }
    vm.setData({
      search: vm.data.search,
      stateIndex: e.detail.value
    })
  },
  // yearChange: function(e) {
  //   var vm = this
  //   vm.data.search.yearType = vm.data.memberYearList[e.detail.value].fieldValue
  //   // 会员钱数
  //   if(vm.data.search.yearType != 0){
  //     wx.request({
  //       url: app.globalData.getSecCode,
  //       method: 'POST',
  //       data: {
  //         fieldName: 'discount',
  //         fieldValue: vm.data.search.yearType
  //       },
  //       header: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       success: function(res){
  //         vm.data.moneyValue = res.data.list[0].valueMeaning
  //         vm.setData({
  //           moneyValue: vm.data.moneyValue
  //         })
  //       },
  //       fail: function() {
  //       },
  //       complete: function() {
  //       }
  //     })
  //   }else{
  //     vm.setData({
  //       moneyValue: 0
  //     })
  //   }
  //   this.setData({
  //     search: vm.data.search,
  //     yearIndex: e.detail.value
  //   })
  // },
  yaoqingValue: function(e) {
    var vm = this
    vm.setData({
      yaoqingvalue: e.detail.value
    })
  },
  onLoad: function() {
    var vm = this
    wx.getStorage({
      key: 'memId',
      success: function(res){
        vm.setData({
          yaoqingvalue: res.data
        })
      }
    })
    // 会员年限
    // wx.request({
    //   url: app.globalData.getSecCode,
    //   method: 'POST',
    //   data: {
    //     fieldName: 'memberType',
    //     fieldValue: 0
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function(res){
    //     console.log(res.data.list)
    //     vm.data.memberYearList = res.data.list
    //     vm.data.memberYearList.unshift({
    //       fieldName: "memberType",
    //       sn: "0",
    //       valueMeaning: "请选择会员年限",
    //       fieldValue: 0,
    //     })
    //     vm.setData({
    //       memberYearList: res.data.list
    //     })
    //   },
    //   fail: function() {
    //   },
    //   complete: function() {
    //   }
    // })
    // 会员分类
    wx.request({
      url: app.globalData.getSecCode,
      method: 'POST',
      data: {
        fieldName: 'memStatus',
        fieldValue: 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        vm.data.stateList = res.data.list
        vm.data.stateList.unshift({
          fieldName: "memStatus",
          sn: "0",
          valueMeaning: "请选择会员类别",
          fieldValue: 0
        })
        vm.setData({
          stateList: res.data.list
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
    // if(vm.data.search.yearType === null || vm.data.search.yearType === undefined || vm.data.search.yearType==0){
    //   wx.showToast({
    //     title:'请选择会员年限',
    //     icon:'none',
    //     duration: 2000
    //   })
    //   return false
    // }
    if(vm.data.search.stateValue === null || vm.data.search.stateValue === undefined || vm.data.search.stateValue==0){
      wx.showToast({
        title:'请选择会员类别',
        icon:'none',
        duration: 2000
      })
      return false
    }
    // if(vm.data.search.stateValue !== 0 && vm.data.search.yearType !== 0){
    if(vm.data.search.stateValue !== 0){
      // 支付接口
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
                    // memberType: vm.data.search.yearType,
                    memberType: 1,
                    discount: vm.data.moneyValue,
                    couponId: '001',
                    memState: 1,
                    agId: vm.data.yaoqingvalue,
                    memStatus: vm.data.search.stateValue
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
                      // wx.switchTab({
                      //   url: '../my/my',
                      // })
                    }else if(res.data.code === 500) {
                      wx.showToast({
                        title: '注册失败,请重试',
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