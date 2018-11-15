const app = getApp()

Page({
  data: {
    hidden: true,
    showMask: false,
    activityList: [],
    type: 0,
    typeDetails: 0,
    showNot: false,
    colorOne: '#3b3b3b',
    colorTwo: '#3b3b3b',
    colorThree: '#3b3b3b',
    clickDownOne: '../../../static/img/down-arrow.png',
    clickDownTwo: '../../../static/img/down-arrow.png',
    clickDownThree: '../../../static/img/down-arrow.png',
    sortLists:[
      {id: 1, type: 1, name: '综合排序', isSelect: false},
      {id: 2, type: 2, name: '人气排序', isSelect: false}
    ],
    showSort:false,
    screenLists: [
      {type: 1, name: '和平区'},
      {type: 2, name: '浑南区'},
      {type: 3, name: '沈北新区'},
      {type: 4, name: '沈河区'},
      {type: 5, name: '皇姑区'},
      {type: 6, name: '大东区'},
      {type: 7, name: '铁西区'},
      {type: 8, name: '于洪区'},
      {type: 9, name: '苏家屯区'},
    ],
    showScreen: false
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  openRecruit: function(e) {
    var vm = this
    wx.navigateTo({
      url: '../recruit/recruit?sn=' + e.currentTarget.dataset.sn
    })
  },
  onShow: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    wx.request({
      url: app.globalData.allActivities,
      data: {
        openid: app.globalData.openid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        vm.data.activityList = res.data.rows
        vm.setData({
          hidden: true,
          activityList: vm.data.activityList
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  clickTabOne: function(e) {
    var vm = this
    vm.setData({
      colorOne: '#ff6d00',
      colorTwo: '#3b3b3b',
      colorThree: '#3b3b3b',
      clickDownOne: '../../../static/img/up-arrow.png',
      clickDownTwo: '../../../static/img/down-arrow.png',
      clickDownThree: '../../../static/img/down-arrow.png',
      showMask: true,
      showSort: true,
      showScreen: false,
    })
  },
  clickTabTwo: function(e) {
    var vm = this
    vm.setData({
      colorOne: '#3b3b3b',
      colorTwo: '#ff6d00',
      colorThree: '#3b3b3b',
      clickDownOne: '../../../static/img/down-arrow.png',
      clickDownTwo: '../../../static/img/up-arrow.png',
      clickDownThree: '../../../static/img/down-arrow.png',
    })
  },
  clickTabThree: function(e) {
    var vm = this
    vm.setData({
      colorOne: '#3b3b3b',
      colorTwo: '#3b3b3b',
      colorThree: '#ff6d00',
      clickDownOne: '../../../static/img/down-arrow.png',
      clickDownTwo: '../../../static/img/down-arrow.png',
      clickDownThree: '../../../static/img/up-arrow.png',
      showMask: true,
      showSort: false,
      showScreen: true
    })
  },
  openSortLists: function(e){
    var vm = this
    var type = e.currentTarget.dataset.item.type
    vm.setData({
      showMask: false,
      showSort: false,
      showScreen: false,
      colorOne: '#3b3b3b',
      clickDownOne: '../../../static/img/down-arrow.png',
    })
  },
  openScreenLists: function(e) {
    var vm = this
    var type = e.currentTarget.dataset.item.type
    console.log(type)
    vm.setData({
      showMask: false,
      showSort: false,
      showScreen: false,
      colorThree: '#3b3b3b',
      clickDownThree: '../../../static/img/down-arrow.png',
    })
  },
  closeList: function() {
    var vm = this
    vm.setData({
      showMask: false,
      showSort: false,
      showScreen: false,
      colorOne: '#3b3b3b',
      colorTwo: '#3b3b3b',
      colorThree: '#3b3b3b',
      clickDownOne: '../../../static/img/down-arrow.png',
      clickDownTwo: '../../../static/img/down-arrow.png',
      clickDownThree: '../../../static/img/down-arrow.png',
    })
  }
})