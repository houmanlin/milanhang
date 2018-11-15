const app = getApp()

Page({
  data:{
    mySn: '000',
    activityprice: 0,
    activityname: '',
    activityid: '',
    ifMember: true,
    ifNotCoupons: true,
    userType: 0,
    showPopBox: false,
    couponsList: [],
    hidden: true,
    nowPrice: 0,
    clickIndex: 0,
    moneyName: '请选择',
    end_time: null,
    memId: '',
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function(options) {
    var vm = this
    vm.data.activityprice = options.activityprice
    vm.data.otherPrice = options.activityprice
    vm.data.activityid = options.activityid
    vm.data.activityname = options.activityname
    vm.data.nowPrice = 0
    vm.setData({
      activityprice: vm.data.activityprice,
      activityname: vm.data.activityname,
      activityid: vm.data.activityid
    })
    // 验证用户是否是会员,如不是会员则显示没有优惠方式
    wx.request({
      url: app.globalData.authMemberByUser,
      data: {
        openid: app.globalData.openid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.code === 200){
          vm.setData({
            ifMember: true
          })
          // 验证用户是否还有剩余优惠券,如没有则不显示
          wx.request({
            url: app.globalData.findUserCouponMsg,
            data: {
              openid: app.globalData.openid,
              couponType: 2
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if(res.data.code === 200){
                vm.setData({
                  ifNotCoupons: false
                })
              }else if(res.data.code === 500){
                vm.setData({
                  ifNotCoupons: true
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
        }else if(res.data.code === 500){
          vm.setData({
            ifMember: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
    // 获取用户会员类型
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
          if(res.data.rows.memId != ''){
            vm.data.memId = res.data.rows.memId
          }else{
            vm.data.memId = 0
          }
          console.log(vm.data.memId)
        }else if(res.data.code === 500){
          console.log('您还没有会员信息')
          vm.data.memId = 0
          console.log(vm.data.memId)
        }
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  },
  gotoCoupons: function() {
    var vm = this
    vm.setData({
      showPopBox: true,
      hidden: false
    })
    wx.request({
      url: app.globalData.findUserCouponMsg,
      data: {
        openid: app.globalData.openid,
        couponType: 2
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var couponsList = res.data.rows
        vm.data.mySn = couponsList[0].sn
        if(res.data.code === 200){
          console.log('用户还有剩余优惠券')
          res.data.rows.forEach((item, index) => {
            item.end_time = item.end_time.substring(0,10)
            if(item.state === 1) {
              vm.setData({
                couponsList: couponsList
              })
            }else{
              couponsList.splice(index, 1)
              vm.setData({
                couponsList: couponsList
              })
            }
            vm.setData({
              end_time: item.end_time
            })
          });
        }else if(res.data.code === 500){
          console.log('用户没有优惠券')
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
  useCoupons: function(e) {
    var vm = this
    var id = e.currentTarget.id
    vm.setData({
      clickIndex: id
    })
    wx.request({
      url: app.globalData.findUserCouponMsg,
      data: {
        openid: app.globalData.openid,
        couponType: 2
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.code === 200){
          console.log('用户还有剩余优惠券')
          var sn = res.data.rows[id].sn
          if(res.data.rows[id].state === 1){
            vm.data.mySn = sn
          }else{
            vm.data.mySn = '000'
          }
          vm.data.nowPrice = res.data.rows[id].coupon_money
          vm.setData({
            nowPrice: vm.data.nowPrice
          })
        }else if(res.data.code === 500){
          console.log('用户没有优惠券')
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  makeSureCoupons: function(){
    var vm = this
    var couponsList = vm.data.couponsList
    wx.request({
      url: app.globalData.findUserCouponMsg,
      data: {
        openid: app.globalData.openid,
        couponType: 2
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(vm.data.mySn === couponsList[0].sn){
          vm.data.mySn = couponsList[0].sn
          vm.data.nowPrice = couponsList[0].coupon_money
        }else{
          vm.data.mySn = vm.data.mySn
          vm.data.nowPrice = vm.data.nowPrice
        }
        vm.setData({
          hidden: true,
          nowPrice: vm.data.nowPrice,
          moneyName: '支付立减' + vm.data.nowPrice + "元"
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
    vm.setData({
      showPopBox: false
    })
  },
  closePopBox: function() {
    var vm = this
    vm.setData({
      showPopBox: false
    })
  },
  goBackActivity: function() {
    var vm = this
    var otherPrice = 0
    otherPrice = vm.data.activityprice - vm.data.nowPrice
    console.log(vm.data.nowPrice)
    console.log(vm.data.activityprice)
    console.log(otherPrice)
    // 支付接口
    if(otherPrice >= 0) {
      wx.request({
        url: app.globalData.pay,
        method: 'POST',
        data: {
          openid: app.globalData.openid,
          body: vm.data.activityname,
          total: otherPrice,
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
                wx.request({
                  url: app.globalData.enroll,
                  data: {
                    openid: app.globalData.openid,
                    activityid: vm.data.activityid,
                    memId: vm.data.memId
                  },
                  method: 'POST',
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  success: function(res){
                    if(res.data.code === 200) {
                      wx.showToast({
                        title: '报名成功',
                        icon: 'none',
                        duration: 3000
                      })
                      wx.request({
                        url: app.globalData.changeUserCoupState,
                        data: {
                          openid: app.globalData.openid,
                          couponId: vm.data.mySn
                        },
                        method: 'POST',
                        header: {
                          "content-type": "application/x-www-form-urlencoded"
                        },
                        success: function(res){
                          console.log(res)
                        },
                        fail: function() {
                        },
                        complete: function() {
                        }
                      })
                      // wx.navigateTo({
                      //   url: '../activity/activity'
                      // })
                    }else if(res.data.code === 500) {
                      wx.showToast({
                        title: '报名失败,请重试',
                        icon: 'none'
                      })
                    }
                  },
                  fail: function() {
                  },
                  complete: function() {
                  }
                })
              },
              'fail': function (res) {
                wx.showToast({
                  title: '您已放弃本次支付',
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
  }
})