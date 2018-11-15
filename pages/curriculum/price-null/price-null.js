const app = getApp()

Page({
  data:{
    curriculumid: '',
    curriculumname: '',
    memId: '',
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function(options) {
    var vm = this
    vm.data.curriculumid = options.curriculumid
    vm.data.curriculumname = options.curriculumname
    vm.setData({
      curriculumname: vm.data.curriculumname,
      curriculumid: vm.data.curriculumid
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
  // 点击确认报名
  goBackActivity: function() {
    var vm = this
    wx.request({
      url: app.globalData.SetCourseEnroll,
      data: {
        openid: app.globalData.openid,
        courseid: vm.data.curriculumid,
        memId: vm.data.memId,
        courType: 0,
        inviteMemUsed: 0
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
          // wx.navigateTo({
          //   url: '../curriculum/curriculum'
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
  }
})