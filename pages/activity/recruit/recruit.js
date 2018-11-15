const app = getApp()
Page({
  data:{
    goodList: [],
    titleImg: null,
    activityprice: 0,
    activityname: '',
    activityid: '',
    signImg: '../../../static/img/recruit_14.png',
    activityImageList: [
      "../../../static/img/myactivity_06.png",
      "../../../static/img/myactivity_08.png",
      "../../../static/img/myactivity_20.png"
    ],
    imgList: [],
    hidden: true,
    endTime: null,
    tips: '会员优惠券抵扣',
    mySn: '',
    videoFalse: false,
    showVidImg: true,
    state: '',
    optiType: 0,
  },
  // 返回前一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  
  onLoad: function(options) {
    var vm = this
    vm.setData({
      hidden: false
    })
    vm.data.mySn = options.sn
    // 初始化活动列表信息
    wx.request({
      url: app.globalData.oneActivity,
      data: {
        openid: app.globalData.openid,
        sn: vm.data.mySn
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        vm.data.goodList = res.data.rows
        var endTime = 0
        console.log(vm.data.goodList)
        vm.data.optiType = vm.data.goodList[0].optiType
        // 判断如果活动结束则不可再点击报名
        if(vm.data.goodList[0].state === 1) {
          vm.setData({
            signImg: '../../../static/img/recruit_14.png'
          })
        }else if(vm.data.goodList[0].state === 2){
          vm.setData({
            signImg: '../../../static/img/recruit_16.png'
          })
        }
        // 显示报名人头像
        wx.request({
          url: app.globalData.findActiHeadUrl,
            data: {
              openid: app.globalData.openid,
              activityid: vm.data.goodList[0].sn
            },
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              if(res.data.code == 200) {
                vm.data.imgList = res.data.rows
                vm.setData({
                  imgList: vm.data.imgList
                })
              }else if(res.data.code == 500){
                console.log('暂无报名')
              }
            },
            fail: function() {
            },
            complete: function() {
            }
        })
        vm.setData({
          hidden: true,
          endTime: endTime,
          tips: '会员优惠券抵扣',
          activityprice: vm.data.goodList[0].price,
          activityname: vm.data.goodList[0].title,
          activityid: vm.data.goodList[0].sn,
          goodList: vm.data.goodList,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  onShow: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    // 初始化活动列表信息
    wx.request({
      url: app.globalData.oneActivity,
      data: {
        openid: app.globalData.openid,
        sn: vm.data.mySn
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        vm.data.goodList = res.data.rows
        var endTime = 0
        console.log(vm.data.goodList)
        // 判断如果活动结束则不可再点击报名
        if(vm.data.goodList[0].state === 1) {
          vm.setData({
            signImg: '../../../static/img/recruit_14.png'
          })
        }else if(vm.data.goodList[0].state === 2){
          vm.setData({
            signImg: '../../../static/img/recruit_16.png'
          })
        }
        // 显示报名人头像
        wx.request({
          url: app.globalData.findActiHeadUrl,
            data: {
              openid: app.globalData.openid,
              activityid: vm.data.goodList[0].sn
            },
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              if(res.data.code == 200) {
                vm.data.imgList = res.data.rows
                vm.setData({
                  imgList: vm.data.imgList
                })
              }else if(res.data.code == 500){
                console.log('暂无报名')
              }
            },
            fail: function() {
            },
            complete: function() {
            }
        })
        vm.setData({
          hidden: true,
          endTime: endTime,
          activityprice: vm.data.goodList[0].price,
          activityname: vm.data.goodList[0].title,
          activityid: vm.data.goodList[0].sn,
          goodList: vm.data.goodList,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  openLogin: function(e) {
    var vm = this
    // 判断是否还可以报名
    if(vm.data.goodList[0].state === 1){
      // 判断用户是否报名过某个活动
      wx.request({
        url: app.globalData.checkActiByUser,
        data: {
          openid: app.globalData.openid,
          activityid: vm.data.goodList[0].sn
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res){
          if(res.data.code === 200) {
            console.log('可以申请报名')
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
                if(data.data.code === 200){
                  console.log('该用户初次绑定手机号码')
                  wx.navigateTo({
                    url: '../../login/login'
                  })
                }else if (data.data.code === 500) {
                  console.log("该用户已经绑定过手机号")
                  // 判断该用户是否是会员
                  wx.request({
                    url: app.globalData.authMemberByUser,
                    data: {
                      openid: app.globalData.openid
                    },
                    header: {
                      "content-type": "application/x-www-form-urlencoded"
                    },
                    success: function(res){
                      if(res.data.code === 200){
                        console.log('您已是会员')
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
                              vm.data.state = res.data.rows.memStatus
                              if(vm.data.state == 1) {
                                console.log('您是体验会员')
                                if(vm.data.optiType == 1) {
                                  wx.showToast({
                                    title: '该活动仅限vip会员参加哦~',
                                    icon: 'none'
                                  })
                                }else if (vm.data.optiType == 0){
                                  // 判断是不是免费，免费提示确定报名
                                  if (vm.data.goodList[0].price === 0) {
                                    wx.navigateTo({
                                      url: '../price-null/price-null?activityid=' + e.currentTarget.dataset.activityid + '&activityname=' + e.currentTarget.dataset.activityname
                                    })
                                  }else{
                                    // 如果不是免费的，则跳转到支付页面支付
                                    wx.navigateTo({
                                      url: '../pay/pay?activityprice=' + e.currentTarget.dataset.price + '&activityname=' + e.currentTarget.dataset.activityname + '&activityid=' + e.currentTarget.dataset.activityid
                                    })
                                  }
                                }
                              }else if(vm.data.state == 2){
                                console.log('您是正式会员')
                                // 判断是不是免费，免费提示确定报名
                                if (vm.data.goodList[0].price === 0) {
                                  wx.navigateTo({
                                    url: '../price-null/price-null?activityid=' + e.currentTarget.dataset.activityid + '&activityname=' + e.currentTarget.dataset.activityname
                                  })
                                }else{
                                  // 如果不是免费的，则跳转到支付页面支付
                                  wx.navigateTo({
                                    url: '../pay/pay?activityprice=' + e.currentTarget.dataset.price + '&activityname=' + e.currentTarget.dataset.activityname + '&activityid=' + e.currentTarget.dataset.activityid
                                  })
                                }
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
                      }else if(res.data.code === 500){
                        console.log('您还不是会员')
                        wx.showModal({
                          title: '提示',
                          content: '成为会员可享受更多优惠哦~',
                          cancelText: '我是土豪',
                          confirmText: '成为会员',
                          success: function(res) {
                            if(res.confirm) {
                              wx.navigateTo({
                                url: '../../mine/register-member/register-member'
                              })
                            }else if (res.cancel) {
                              console.log('您已放弃成为会员')
                              if (vm.data.goodList[0].price === 0) {
                                wx.navigateTo({
                                  url: '../price-null/price-null?activityid=' + e.currentTarget.dataset.activityid + '&activityname=' + e.currentTarget.dataset.activityname
                                })
                              }else{
                                // 如果不是免费的，则跳转到支付页面支付
                                wx.navigateTo({
                                  url: '../pay/pay?activityprice=' + e.currentTarget.dataset.price + '&activityname=' + e.currentTarget.dataset.activityname + '&activityid=' + e.currentTarget.dataset.activityid
                                })
                              }
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
          }else if(res.data.code === 500){
            wx.showToast({
              title: '已报名此活动，无需再次报名',
              icon: 'none'
            })
          }
        },
        fail: function() {
        },
        complete: function() {
        }
      })
    }else if(vm.data.goodList.state === 2){
      wx.showToast({
        title: '报名人数已达上限',
        icon: 'none',
        duration: 3000
      })
    }
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('bigVideo')
  },
  openVideo: function() {
    var vm = this
    vm.setData({
      videoFalse: true
    });
  },
  videoPlay: function () {
    var vm = this
    this.videoContext.play()
    vm.setData({
      showVidImg: false
    })
  }
})