const app = getApp()

Page({
  data: {
    hidden: true,
    showMask: false,
    curriculumList: [],
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
      {id: 1, type: 1, name: '默认排序', isSelect: false}
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
    showScreen: false,
    typename: '',
    showClassify: false,
    classifyLists: [],
    curNav: 1,
    curIndex: 0,
    showItems: [],
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  openCurriculumDetail: function(e) {
    wx.navigateTo({
      url: '../curriculum-detail/curriculum-detail?sn=' + e.currentTarget.dataset.sn
    })
  },
  onShow: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 2,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title:'',
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
            curriculumList: res.data.rows,
            hidden: true
          })
        }else{
          console.log('暂无数据')
        }
      },
      fail: function (res) {
      }
    })
  },
  onLoad: function(options) {
    var vm = this
    vm.data.typename = options.name
    console.log(vm.data.typename)
    vm.setData({
      typename: vm.data.typename
    })
    wx.request({
      url: app.globalData.allcoursetype,
      data: {
        courType: 1
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        console.log(res.data.rows)
        for (var i = 0; i < res.data.rows.length; i++) {
          vm.data.showItems.push(false)
        }
        vm.data.showItems[0] = true
        vm.setData({
          classifyLists: res.data.rows,
          showItems: vm.data.showItems
        })
      },
      fail: function() {
      },
      complete: function() {
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
      showClassify: false
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
      showClassify: true,
      showMask: true,
      showSort: false,
      showScreen: false,
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
      showScreen: true,
      showClassify: false,
    })
  },
  openSortLists: function(e){
    var vm = this
    var type = e.currentTarget.dataset.item.type
    vm.setData({
      showMask: false,
      showSort: false,
      showScreen: false,
      showClassify: false,
      colorOne: '#3b3b3b',
      clickDownOne: '../../../static/img/down-arrow.png',
      hidden: false
    })
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 2,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title:'',
        courType: 0
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data.rows)
        if(res.data.rows){
          vm.data.curriculumList = res.data.rows
          vm.setData({
            curriculumList: res.data.rows,
            hidden: true,
            showNot: false
          })
        }else{
          console.log('暂无数据')
          vm.setData({
            hidden: true,
            showNot: true
          })
        }
      },
      fail: function (res) {
      }
    })
  },
  switchRightTab: function(e) {
    var vm = this
    let index = e.target.dataset.index
    let sn = e.target.dataset.sn
    for (var i = 0; i < vm.data.showItems.length; i++) {
      vm.data.showItems[i] = false
    }
    vm.data.showItems[index] = true
    vm.setData({
      showItems: vm.data.showItems,
      curNav: sn
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
      showClassify: false,
      colorThree: '#3b3b3b',
      clickDownThree: '../../../static/img/down-arrow.png',
      hidden: false
    })
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 2,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:type,
        courKgI: 0,
        courKgII: 0,
        title:'',
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
            curriculumList: res.data.rows,
            hidden: true,
            showNot: false
          })
        }else{
          console.log('暂无课程')
          vm.setData({
            hidden: true,
            showNot: true
          })
        }
      },
      fail: function (res) {
      }
    })
  },
  closeList: function() {
    var vm = this
    vm.setData({
      showMask: false,
      showSort: false,
      showScreen: false,
      showClassify: false,
      colorOne: '#3b3b3b',
      colorTwo: '#3b3b3b',
      colorThree: '#3b3b3b',
      clickDownOne: '../../../static/img/down-arrow.png',
      clickDownTwo: '../../../static/img/down-arrow.png',
      clickDownThree: '../../../static/img/down-arrow.png',
    })
  }
})