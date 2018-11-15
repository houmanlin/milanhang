const app = getApp()

Page({
  data: {
    curriculumList: [],
    searchVal: ''
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  openCurriculumDetail: function(e) {
    wx.navigateTo({
      url: '../curriculum/curriculum-detail/curriculum-detail?sn=' + e.currentTarget.dataset.sn
    })
  },
  searchValue: function(e) {
    var vm = this
    vm.data.searchVal = e.detail.value
    vm.setData({
      searchVal: e.detail.value
    })
  },
  sendSearch: function() {
    var vm = this
    console.log(vm.data.searchVal)
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 0,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title: vm.data.searchVal,
        courType: 0
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if(res.data.code == "500"){
          wx.showToast({
            title: '未查找到相关信息',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
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
  }
})