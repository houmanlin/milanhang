const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: 0,
    imgUrls: [],
    autoplay: true,
    interval: 5000,
    duration: 500,
    activityList: [],
    curriculumList: [],
    curriculumListTui: [],
    practiceList: [],
    hidden: true,
    actLists: [
      //{id: '1', type:1, name: "推荐活动", isSelect: false},
      {id: '2', type:2, name: "推荐课程", isSelect: true}
    ],
    courLists: [
      {id: '2', type:1, name: "IT互联网"},
      {id: '3', type:2, name: "设计·创作"},
      {id: '4', type:3, name: "语言·留学"},
      {id: '5', type:4, name: "职业·考证"},
      {id: '6', type:5, name: "升学·考研"},
      {id: '7', type:6, name: "兴趣·生活"},
    ],
    // pracLists:[
    //   {id: '2', type:7, name: "高端兼职"},
    //   {id: '3', type:8, name: "社会公益"}
    // ],
    type: 0,
    typeDetailI: 0,
    typeDetailII: 0,
    typeDetailIII: 0,
    courArea:0,
    id: '2',
    name: ''
  },

  openMember: function() {
    wx.navigateTo({
      url: '../mine/member/member',
    })
  },
  onShareAppMessage: function () {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: '美课优选',
      path: '/pages/index/index'
    }
  },
  openVideo: function() {
    wx.navigateTo({
      url: '../smallVideo/smallVideo'
    })
  },
  gotoSearch: function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onLoad: function (options) {
    var vm = this
    wx.setStorage({
      key: 'memId',
      data: options.memId
    })
    vm.setData({
      hidden: false
    })
    if(app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: 1
      })
      vm.dataList()
    }else{
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                app.globalData.userInfo = res.userInfo
                wx.request({
                  url: app.globalData.authWxMessage,
                  data: {
                    openid: app.globalData.openid
                  },
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  success: function (res) {
                    if (res.data.code == 200) {
                      vm.setData({
                        hasUserInfo: 1
                      })
                      vm.dataList()
                    } else {
                      wx.request({
                        url: app.globalData.register,
                        data: {
                          openid: app.globalData.openid,
                          wxname: app.globalData.userInfo.nickName,
                          gender: app.globalData.userInfo.gender,
                          province: app.globalData.userInfo.province,
                          city: app.globalData.userInfo.city,
                          country: app.globalData.userInfo.country,
                          headUrl: app.globalData.userInfo.avatarUrl
                        },
                        header: {
                          "content-type": "application/x-www-form-urlencoded"
                        },
                        success: function (res) {
                          vm.setData({
                            hasUserInfo: 1
                          })
                          vm.dataList()
                        },
                        fail: function (res) {
                        }
                      })
                    }
                  },
                  fail: function (res) {
                  }
                })
              }
            })
          }else{
            vm.setData({
              hasUserInfo: 2
            })
          }
        }
      })
    }
    if(this.data.canIUse){
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          hasUserInfo: 1
        })
        vm.dataList()
      }
    }
  },
  onShow: function (){
    var vm = this
    vm.dataList()
    vm.data.actLists.forEach(item => {
      item.isSelect = false
    });
    vm.data.actLists[0].isSelect = true
    vm.data.courLists.forEach(item => {
      item.isSelect = false
    });
    vm.data.courLists[0].isSelect = true
    // vm.data.pracLists.forEach(item => {
    //   item.isSelect = false
    // });
    // vm.data.pracLists[0].isSelect = true
    vm.setData({
      actLists:vm.data.actLists,
      courLists:vm.data.courLists,
      //pracLists:vm.data.pracLists,
      id: '2'
      // name: 'IT互联网',
      // typeDetailI: 1
    })
  },
  bindGetUserInfo: function (e) {
    var vm = this
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      var that = this;
      wx.request({
        url: app.globalData.authWxMessage,
        data: {
          openid: app.globalData.openid
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 200) {
            vm.setData({
              hasUserInfo: 1
            })
            vm.dataList()
          } else {
            wx.request({
              url: app.globalData.register,
              data: {
                openid: app.globalData.openid,
                wxname: app.globalData.userInfo.nickName,
                gender: app.globalData.userInfo.gender,
                province: app.globalData.userInfo.province,
                city: app.globalData.userInfo.city,
                country: app.globalData.userInfo.country,
                headUrl: app.globalData.userInfo.avatarUrl
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                vm.setData({
                  hasUserInfo: 1
                })
                vm.dataList()
              },
              fail: function (res) {
              }
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  dataList: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    wx.request({
      url: app.globalData.getHomePagePath,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        
         console.log( res.data.list)
        if(res.data.code === 200){
          vm.data.imgUrls = res.data.list
          vm.setData({
            imgUrls: vm.data.imgUrls
          })
        }
      },
      fail: function() {
      },
      complete: function() {
      }
    })
    //推荐课程
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 0,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea: 0,
        courKgI: 1,
        courKgII: 0,
        title: '',
        courType: 0
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.rows) {
          vm.data.curriculumListTui = res.data.rows
          vm.setData({
            curriculumListTui: res.data.rows
          })
        }
      },
      fail: function (res) {
     
      }
    })
    //推荐活动
    // wx.request({
    //   url: app.globalData.allActivities,
    //   data: {
    //     openid: app.globalData.openid
    //   },
    //   header: {
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
     
    //     vm.data.activityList = res.data.rows
    //     vm.setData({
    //       hidden: true,
    //       activityList: res.data.rows
    //     })
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // })
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 1,
        typeDetailI: 1,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title: '',
        courType: 0
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        
        if(res.data.rows){
          vm.data.curriculumList = res.data.rows
          vm.setData({
            curriculumList: res.data.rows
          })
        }
      },
      fail: function (res) {
      }
    })
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 2,
        typeDetailI: 7,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title: '',
        courType: 0
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        
         console.log(res)
        if(res.data.rows){
          vm.data.practiceList = res.data.rows
          vm.setData({
          practiceList: res.data.rows
        })
        }
      },
      fail: function (res) {
      }
    })
  },
  changeActTab: function (e) {
    var vm = this
    var id = e.currentTarget.dataset.item.id;
    vm.data.id = id
    var curIndex = 0;
    vm.data.type = e.currentTarget.dataset.item.type
    vm.setData({
      hidden: false
    })
    for (var i = 0; i < vm.data.actLists.length; i++) {
      if (id == vm.data.actLists[i].id) {
        vm.data.actLists[i].isSelect = true;
        curIndex = i;
      } else {
        vm.data.actLists[i].isSelect = false;
      }
    }
    vm.setData({
      actLists: vm.data.actLists,
    });
    if(vm.data.id == "1") {
      wx.request({
        url: app.globalData.allActivities,
        data: {
          openid: app.globalData.openid
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          vm.data.activityList = res.data.rows
          vm.setData({
            hidden: true,
            activityList: res.data.rows
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }else if(vm.data.id == "2"){
      wx.request({
        url: app.globalData.allCources,
        data: {
          openid: app.globalData.openid,
          type: 0,
          typeDetailI: 0,
          typeDetailII: 0,
          typeDetailIII: 0,
          courArea:0,
          courKgI: 1,
          courKgII: 0,
          title: '',
          courType: 0
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res)
          if(res.data.rows){
            vm.data.curriculumListTui = res.data.rows
            vm.setData({
              curriculumListTui: res.data.rows
            })
          }
        },
        fail: function (res) {
        }
      })
    }
    vm.setData({
      id: vm.data.id
    })
  },
  changeCourTab: function(e) {
    var vm = this
    var id = e.currentTarget.dataset.item.id;
    var curIndex = 0;
    vm.data.typeDetailI = e.currentTarget.dataset.item.type
    vm.data.name = e.currentTarget.dataset.item.name
    vm.setData({
      hidden: false
    })
    for (var i = 0; i < vm.data.courLists.length; i++) {
      if (id == vm.data.courLists[i].id) {
        vm.data.courLists[i].isSelect = true;
        curIndex = i;
      } else {
        vm.data.courLists[i].isSelect = false;
      }
    }
    vm.setData({
      courLists: vm.data.courLists,
    });
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 1,
        typeDetailI: vm.data.typeDetailI,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title: '',
        courType: 0
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(res)
        if(res.data.rows){
          vm.data.curriculumList = res.data.rows
          vm.setData({
            hidden: true,
            curriculumList: res.data.rows
          })
        }else{
          console.log('暂无课程')
        }
      },
      fail: function (res) {
      }
    })
  },
  changePraTab: function(e) {
    var vm = this
    var id = e.currentTarget.dataset.item.id;
    var curIndex = 0;
    vm.data.typeDetailI = e.currentTarget.dataset.item.type
    vm.data.name = e.currentTarget.dataset.item.name
    vm.setData({
      hidden: false
    })
    for (var i = 0; i < vm.data.pracLists.length; i++) {
      if (id == vm.data.pracLists[i].id) {
        vm.data.pracLists[i].isSelect = true;
        curIndex = i;
      } else {
        vm.data.pracLists[i].isSelect = false;
      }
    }
    vm.setData({
      pracLists: vm.data.pracLists,
    });
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 2,
        typeDetailI: vm.data.typeDetailI,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title: '',
        courType: 0
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if(res.data.rows){
          vm.data.practiceList = res.data.rows
          vm.setData({
            hidden: true,
            practiceList: res.data.rows
          })
        }else{
          console.log('暂无实践')
        }
      },
      fail: function (res) {
      }
    })
  },
  openActivity: function() {
    wx.navigateTo({
      url: '../activity/activity/activity'
    })
  },
  openRecruit: function(e) {
    var vm = this
    wx.navigateTo({
      url: '../activity/recruit/recruit?sn=' + e.currentTarget.dataset.sn
    })
  },
  openCurriculum: function() {
    var vm = this
    if(vm.data.typeDetailI != 0){
      vm.data.typeDetailI = vm.data.typeDetailI
      vm.data.name = vm.data.name
    }else{
      vm.data.typeDetailI = 1
      vm.data.name = 'IT互联网'
    }
    wx.navigateTo({
      url: '../curriculum/curriculum/curriculum?name=' + vm.data.name + "&typeDetailI=" + vm.data.typeDetailI
    })
    vm.data.typeDetailI = 0
  },
  openCurriculumDetail: function(e) {
    wx.navigateTo({
      url: '../curriculum/curriculum-detail/curriculum-detail?sn=' + e.currentTarget.dataset.sn
    })
  },
  openPractice: function() {
    var vm = this
    if(vm.data.typeDetailI != 0){
      vm.data.typeDetailI = vm.data.typeDetailI
      vm.data.name = vm.data.name
    }else{
      vm.data.typeDetailI = 7
      vm.data.name = '高端兼职'
    }
    wx.navigateTo({
      url: '../curriculum/practice/practice?name=' + vm.data.name + "&typeDetailI=" + vm.data.typeDetailI
    })
    vm.data.typeDetailI = 0
    // vm.data.name = '高端兼职'
  }
})