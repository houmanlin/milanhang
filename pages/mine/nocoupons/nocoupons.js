const app = getApp()

Page({
  data:{
    canList:[],
    showCoupons: true,
    hidden: true,
    endTime: null,
    nomoreCoupons: true
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function() {
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
          // 获取该用户的优惠卷信息
          wx.request({
            url: app.globalData.findUserCouponMsg,
            data: {
              openid: app.globalData.openid,
              couponType: 0
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)
              if(res.data.code === 200){
                console.log('用户还有剩余优惠券')
                res.data.rows.forEach(item => {
                  var endTime = item.end_time.substring(0,10)
                  if(item.state == 2) {
                    vm.data.canList.push({
                      btn: '已使用',
                      src: '../../../static/img/couponsNot.png',
                      endTime: endTime,
                      title: item.title,
                      coupon_money: item.coupon_money
                    })
                    vm.setData({
                      nomoreCoupons: false,
                      canList: vm.data.canList
                    })
                  }
                  if(vm.data.canList.length === 0) {
                    vm.setData({
                      nomoreCoupons: true
                    })
                  }
                });
              }else if(res.data.code === 500){
                console.log('用户没有优惠券')
                vm.setData({
                  nomoreCoupons: true
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
          vm.setData({
            hidden: true,
            showCoupons: true
          })
        }else if(res.data.code == 500){
          console.log('您还不是会员')
          vm.setData({
            hidden: true,
            showCoupons: false,
            nomoreCoupons: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  }
})