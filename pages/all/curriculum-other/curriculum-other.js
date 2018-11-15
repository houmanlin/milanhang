const app = getApp()

Page({
  data:{
    curriculumList: [],
    price: 0.01,
    curriculumid: '',
    curriculumname: '',
    imgList: [],
    signImg: '../../../static/img/recruit_14.png',
    hidden: true,
    mySn: '',
    courtype: '',
    videoFalse: false,
    showVidImg: true,
    state: '',
    optiType: 0,
    memStatus: '',
    memId: '',
    inviteMemOver: '',
    myInviteMemOver: '',
    actionType:''
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function(options) {
    console.log(options)
    var vm = this
 
    vm.setData({
      hidden: false
    })
    vm.data.mySn = options.sn
    vm.data.courtype = options.courtype
    vm.data.actionType = options.actiontype
    console.log(vm.data.actionType);
    //获取单个活动内容

    if (vm.data.actionType != "1"){
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
          
          vm.data.curriculumList = res.data.rows
          // 判断如果活动结束则不可再点击报名
          if (vm.data.curriculumList[0].state === 1) {
            vm.setData({
              signImg: '../../../static/img/recruit_14.png'
            })
          } else if (vm.data.curriculumList[0].state === 2) {
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
            success: function (res) {
              if (res.data.code == 200) {
                vm.data.imgList = res.data.rows
                vm.setData({
                  imgList: vm.data.imgList
                })
              } else if (res.data.code == 500) {
                //console.log('暂无报名')
              }
            },
            fail: function () {
            },
            complete: function () {
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
          //console.log(res);
        }
      })
    }
    if(vm.data.actionType == "1"){
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
    
          console.log(res)
          vm.data.curriculumList = res.data.rows
          // 判断如果活动结束则不可再点击报名
          if (vm.data.curriculumList[0].state === 1) {
            vm.setData({
              signImg: '../../../static/img/recruit_14.png'
            })
          } else if (vm.data.curriculumList[0].state === 2) {
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
            success: function (res) {
              if (res.data.code == 200) {
                vm.data.imgList = res.data.rows
                vm.setData({
                  imgList: vm.data.imgList
                })
              } else if (res.data.code == 500) {
                //console.log('暂无报名')
              }
            },
            fail: function () {
            },
            complete: function () {
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
          //console.log(res);
        }
      })
    }
    
  },
  onShow: function() {

    var vm = this
    console.log(vm.data.actionType);
    vm.setData({
      hidden: false
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
        //console.log(res)
        if(res.data.code === 200) {
          //console.log('您已是会员')
          vm.data.memStatus = res.data.rows.memStatus
          // vm.data.memId = res.data.rows.memId
          if(res.data.rows.memId != ''){
            vm.data.memId = res.data.rows.memId
          }else{
            vm.data.memId = 0
          }
          //console.log(vm.data.memId)
        }else if(res.data.code === 500){
          //console.log('您还没有会员信息')
          vm.data.memId = 0
          //console.log(vm.data.memId)
        }
      },
      fail: function() {
      },
      complete: function() {
      }
    })
    // 获取用户统计信息接口
    wx.request({
      url: app.globalData.getMkCount,
      data: {
        openid: app.globalData.openid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
       
        if(res.data.code === 200){
          vm.data.myInviteMemOver = res.data.list[0].inviteMemOver
        }
      },
      fail: function (res) {
        //console.log(res);
      }
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
        
        vm.data.curriculumList = res.data.rows
        if(vm.data.memStatus == 2){
          vm.data.inviteMemOver = 0
        }else{
          vm.data.inviteMemOver = res.data.rows[0].inviteMemUsed
        }
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
                //console.log('暂无报名')
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
        //console.log(res);
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
            //console.log('可以申请报名')
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
                ////console.log(data.data.code)
                if(data.data.code === 200){
                  //console.log('该用户初次绑定手机号码')
                  wx.navigateTo({
                    url: '../../login/login'
                  })
                }else if (data.data.code === 500) {
                  //console.log("该用户已经绑定过手机号")
                  if(vm.data.memStatus == 2 || vm.data.myInviteMemOver >= vm.data.inviteMemOver){
                    wx.request({
                      url: app.globalData.SetCourseEnroll,
                      data: {
                        openid: app.globalData.openid,
                        courseid: vm.data.curriculumid,
                        memId: vm.data.memId,
                        courType: vm.data.courtype,
                        inviteMemUsed: vm.data.inviteMemOver
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
                          wx.navigateBack({
                            delta: 1
                          })
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
                  }else{
                    wx.showToast({
                      title: '满足票数或已是正式会员才可报名呦~',
                      icon: 'none'
                    })
                  }
                }
              },
              fail: function (res) {
                //console.log(res);
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