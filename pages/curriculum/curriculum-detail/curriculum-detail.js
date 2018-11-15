const app = getApp()

Page({
  data:{
    titleImg: null,
    curriculumImageList: [
      "../../../static/img/image_03.png",
      "../../../static/img/image_06.png"
    ],
    curriculumList: [],
    price: 0.01,
    curriculumid: '',
    curriculumname: '',
    imgList: [],
    signImg: '../../../static/img/recruit_14.png',
    hidden: true,
    mySn: '',
    videoFalse: false,
    showVidImg: true,
    state: '',
    optiType: 0,
  },
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
    wx.request({
      url: app.globalData.oneCource,
      data: {
        openid: app.globalData.openid,
        sn: vm.data.mySn
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        vm.data.curriculumList = res.data.rows
        // 判断如果活动结束则不可再点击报名
        if(vm.data.curriculumList[0].state === 1) {
          vm.setData({
            signImg: '../../../static/img/recruit_14.png'
          })
        }else if(vm.data.curriculumList[0].state === 2){
          vm.setData({
            signImg: '../../../static/img/recruit_16.png'
          })
        }
        // 显示报名人头像
        wx.request({
          url: app.globalData.findCourseHeadUrl,
            data: {
              openid: app.globalData.openid,
              courseid: vm.data.curriculumList[0].sn
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
          curriculumid: vm.data.curriculumList[0].sn,
          curriculumname: vm.data.curriculumList[0].title,
          curriculumList: vm.data.curriculumList,
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
    wx.request({
      url: app.globalData.oneCource,
      data: {
        openid: app.globalData.openid,
        sn: vm.data.mySn
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        vm.data.curriculumList = res.data.rows
        vm.data.optiType = vm.data.curriculumList[0].optiType
        // 判断如果活动结束则不可再点击报名
        if(vm.data.curriculumList[0].state === 1) {
          vm.setData({
            signImg: '../../../static/img/recruit_14.png'
          })
        }else if(vm.data.curriculumList[0].state === 2){
          vm.setData({
            signImg: '../../../static/img/recruit_16.png'
          })
        }
        // 显示报名人头像
        wx.request({
          url: app.globalData.findCourseHeadUrl,
            data: {
              openid: app.globalData.openid,
              courseid: vm.data.curriculumList[0].sn
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
          curriculumid: vm.data.curriculumList[0].sn,
          curriculumname: vm.data.curriculumList[0].title,
          curriculumList: vm.data.curriculumList,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  openLogin: function(e) {
    var vm = this
    // 判断报名活动是否已经结束
    if(vm.data.curriculumList[0].state === 1){
      // 验证某个用户是否重复报名了某个课程
      wx.request({
        url: app.globalData.checkCourseByUser,
        data: {
          openid: app.globalData.openid,
          courseid: vm.data.curriculumList[0].sn
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
                            // console.log(res)
                            if(res.data.code === 200) {
                              console.log('您已是会员')
                              vm.data.state = res.data.rows.memStatus
                              if(vm.data.state == 1) {
                                console.log('您是体验会员')
                                if(vm.data.optiType == 1) {
                                  wx.showToast({
                                    title: '该课程仅限vip会员参加哦~',
                                    icon: 'none'
                                  })
                                }else if (vm.data.optiType == 0){
                                  // 判断是不是免费，免费提示确定报名
                                  if (vm.data.price === 0) {
                                    wx.navigateTo({
                                      url: '../price-null/price-null?curriculumid=' + e.currentTarget.dataset.curriculumid + '&curriculumname=' + e.currentTarget.dataset.curriculumname
                                    })
                                  }else{
                                    wx.navigateTo({
                                      url: '../pay-class/pay-class?price=' + e.currentTarget.dataset.price + '&curriculumname=' + e.currentTarget.dataset.curriculumname + '&curriculumid=' + e.currentTarget.dataset.curriculumid
                                    })
                                  }
                                }
                              }else if(vm.data.state == 2){
                                console.log('您是正式会员')
                                // 判断是不是免费，免费提示确定报名
                                wx.navigateTo({
                                  url: '../price-null/price-null?curriculumid=' + e.currentTarget.dataset.curriculumid + '&curriculumname=' + e.currentTarget.dataset.curriculumname
                                })
                                // if (vm.data.price === 0) {
                                //   wx.navigateTo({
                                //     url: '../price-null/price-null?curriculumid=' + e.currentTarget.dataset.curriculumid + '&curriculumname=' + e.currentTarget.dataset.curriculumname
                                //   })
                                // }else{
                                //   wx.navigateTo({
                                //     url: '../pay-class/pay-class?price=' + e.currentTarget.dataset.price + '&curriculumname=' + e.currentTarget.dataset.curriculumname + '&curriculumid=' + e.currentTarget.dataset.curriculumid
                                //   })
                                // }
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
                          content: '成为会员才可以报名课程哦~',
                          cancelText: '暂不报名',
                          confirmText: '成为会员',
                          success: function(res) {
                            if(res.confirm) {
                              wx.navigateTo({
                                url: '../../mine/register-member/register-member'
                              })
                            }else if (res.cancel) {
                              console.log('您已放弃成为会员')
                              wx.showToast({
                                title: '暂时还不是会员呦~',
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
    }else if(vm.data.curriculumList[0].state === 2){
      wx.showToast({
        title: '报名人数已达上限',
        icon: 'none'
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
  },
})