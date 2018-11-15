const app = getApp()

Page({
  data: {
    playIndex: null,
    courseList: [],
    tabLists: [
      {id: '1', type:1, name: "美课成长", isSelect: true},
      {id: '2', type:2, name: "就业访谈", isSelect: false}
    ],
    tabClickIndex: 0,
    hidden: true,
    videoFalse: false,
    type: 1,
    showNot: false,
    titleName: '美课成长'
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    wx.request({
      url: app.globalData.allMkVideo,
      method: "POST",
      data: {
        openid: app.globalData.openid,
        viType: vm.data.type
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        console.log(res)
        vm.data.courseList = res.data.rows
        vm.setData({
          hidden: true,
          showNot: false,
          courseList: vm.data.courseList,
          titleName: '美课成长'
        })
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  },
  changeTab: function (e) {
    var vm = this
    var id = e.currentTarget.dataset.item.id;
    var curIndex = 0;
    vm.data.type = e.currentTarget.dataset.item.type
    vm.setData({
      hidden: false
    })
    for (var i = 0; i < vm.data.tabLists.length; i++) {
      if (id == vm.data.tabLists[i].id) {
        vm.data.tabLists[i].isSelect = true;
        curIndex = i;
      } else {
        vm.data.tabLists[i].isSelect = false;
      }
    }
    vm.setData({
      tabLists: vm.data.tabLists,
    });
    wx.request({
      url: app.globalData.allMkVideo,
      method: "POST",
      data: {
        openid: app.globalData.openid,
        viType: vm.data.type
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        console.log(res)
        vm.data.courseList = res.data.rows
        if(vm.data.type == 1){
          vm.setData({
            titleName: '美课成长'
          })
        }
        if(vm.data.type == 2){
          vm.setData({
            titleName: '就业访谈'
          })
        }
        vm.setData({
          hidden: true,
          showNot: false,
          courseList: vm.data.courseList
        })
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  },
  // 视频
  videoPlay: function (e) {
    var curIdx = e.currentTarget.dataset.index; 
    if (!this.data.playIndex) {
      this.setData({
        playIndex: curIdx
      })
      var videoContext = wx.createVideoContext('video' + curIdx)
      videoContext.play()
    } else {
      var videoContextPrev = wx.createVideoContext('video' + this.data.playIndex)
      if (this.data.playIndex != curIdx) {
        videoContextPrev.pause()
      }
      this.setData({
        playIndex: curIdx
      })
      var videoContextCurrent = wx.createVideoContext('video' + curIdx)
      videoContextCurrent.play()
    }
  },
  openVideo: function() {
    var vm = this
    vm.setData({
      videoFalse: true
    });
  }
})