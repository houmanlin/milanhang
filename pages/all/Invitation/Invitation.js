const app = getApp()

Page({
  data:{
    memId: ''
  },
  onShareAppMessage: function () {
    var vm = this
    return {
      title: '美课优选',
      path: '/pages/index/index?memId=' + vm.data.memId,
      imageUrl: 'http://video.milanhang.com/image/yaoyue/sharephoto.png'
    }
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function() {
    var vm = this
    // 获取memId
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
        if(res.data.code === 200) {
          vm.data.memId = res.data.rows.memId
          console.log(vm.data.memId)
        }else if(res.data.code === 500){
          console.log('会员信息为空')
        }
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  }
})