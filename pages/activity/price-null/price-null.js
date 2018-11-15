const app = getApp()

Page({
  data:{
    activityname: '',
    activityid: '',
    memId: '',
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function(options) {
    var vm = this
    vm.data.activityid = options.activityid
    vm.data.activityname = options.activityname
    vm.setData({
      activityname: vm.data.activityname,
      activityid: vm.data.activityid
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
      url: app.globalData.enroll,
      data: {
        openid: app.globalData.openid,
        activityid: vm.data.activityid,
        memId: vm.data.memId,
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
  }
})