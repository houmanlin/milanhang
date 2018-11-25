const app = getApp()

Page({
  data:{
    activityList: [],
    curriculumList: [],
    //practiceList: [],
    hidden: true,
    actLength: 0,
    courLength: 0,
    pracLength: 0,
    showAct: true,
    showCour: true,
    showPrac: true
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  openRecruit: function(e) {
    var vm = this
    wx.navigateTo({
      url: '../../activity/recruit/recruit?sn=' + e.currentTarget.dataset.sn
    })
  },
  openCurriculumDetail: function(e) {
    wx.navigateTo({
      url: '../../curriculum/curriculum-detail/curriculum-detail?sn=' + e.currentTarget.dataset.sn
    })
  },
  onShow: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    // 报名活动
    wx.request({
      url: app.globalData.findOwerActivity,
      data: {
        openid: app.globalData.openid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.rows) {
          vm.data.activityList = res.data.rows
          vm.data.actLength = vm.data.activityList.length
          vm.setData({
            hidden: true,
            activityList: vm.data.activityList,
            actLength: vm.data.actLength,
            showAct: true
          })
        }else{
          vm.setData({
            hidden: true,
            showAct: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
    // 报名课程
    wx.request({
      url: app.globalData.findOwerCourse,
      data: {
        openid: app.globalData.openid,
        type: 1
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.rows) {
          vm.data.curriculumList = res.data.rows
          vm.data.courLength = vm.data.curriculumList.length
          vm.setData({
            hidden: true,
            curriculumList: vm.data.curriculumList,
            courLength: vm.data.courLength,
            showCour: true
          })
        }else{
          vm.setData({
            hidden: true,
            showCour: false
          })
        }
      },
      fail: function (res) {
      }
    })
    // 报名实践
    // wx.request({
    //   url: app.globalData.findOwerCourse,
    //   data: {
    //     openid: app.globalData.openid,
    //     type: 2
    //   },
    //   header: {
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     if(res.data.rows) {
    //       vm.data.practiceList = res.data.rows
    //       vm.data.pracLength = vm.data.practiceList.length
    //       vm.setData({
    //         hidden: true,
    //         practiceList: vm.data.practiceList,
    //         pracLength: vm.data.pracLength,
    //         showPrac: true
    //       })
    //     }else{
    //       vm.setData({
    //         hidden: true,
    //         showPrac: false
    //       })
    //     }
    //   },
    //   fail: function (res) {
    //   }
    // })
  },
  openTap: function() {
    wx.showToast({
      title: '暂无奖励，还要继续加油哦~',
      icon: 'none'
    })
  }
})